import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";
import { access, writeFile } from "node:fs/promises";

const url = process.env.SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
const publicKey = process.env.SUPABASE_PUBLISHABLE_KEY;
const password = process.env.DEMO_PASSWORD || randomBytes(18).toString("base64url");
const credentialsPath = new URL("../demo-credentials.txt", import.meta.url);

const CLIENT_OPTIONS = { auth: { persistSession: false, autoRefreshToken: false } };

function checked(result) {
  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data;
}

function validateConfiguration() {
  if (!url || !secretKey || !publicKey) {
    throw new Error("Заполните SUPABASE_URL, SUPABASE_SECRET_KEY и SUPABASE_PUBLISHABLE_KEY в .env.seed.");
  }

  if (password.length < 12) {
    throw new Error("DEMO_PASSWORD должен содержать минимум 12 символов.");
  }
}

async function ensureEmptyProject(admin) {
  const credentialsExist = await access(credentialsPath)
    .then(() => true)
    .catch(() => false);

  if (credentialsExist) {
    throw new Error("demo-credentials.txt уже существует. Используйте существующие тестовые доступы.");
  }

  const existingObjects = checked(await admin.from("construction_objects").select("id").limit(1));

  if (existingObjects.length > 0) {
    throw new Error("Демонстрационное заполнение предназначено только для пустой базы.");
  }
}

async function createDemoUsers(admin) {
  const accounts = [
    { email: "manager@demo.local", full_name: "Анна Смирнова", role: "manager" },
    { email: "executor1@demo.local", full_name: "Алексей Петров", role: "executor" },
    { email: "executor2@demo.local", full_name: "Мария Волкова", role: "executor" }
  ];

  await writeFile(
    credentialsPath,
    [
      "Тестовые доступы к мини-CRM",
      `URL Supabase: ${url}`,
      ...accounts.map(account => `${account.role}: ${account.email}`),
      `Пароль: ${password}`,
      ""
    ].join("\n"),
    { flag: "wx", mode: 0o600 }
  );

  const users = [];

  for (const account of accounts) {
    const { user } = checked(
      await admin.auth.admin.createUser({
        email: account.email,
        password,
        email_confirm: true,
        user_metadata: { full_name: account.full_name },
        app_metadata: { crm_role: account.role }
      })
    );

    if (!user) {
      throw new Error("Не удалось создать тестового пользователя.");
    }

    checked(
      await admin
        .from("profiles")
        .update({ full_name: account.full_name, role: account.role })
        .eq("id", user.id)
        .select("id")
        .single()
    );

    const client = createClient(url, publicKey, CLIENT_OPTIONS);
    checked(await client.auth.signInWithPassword({ email: account.email, password }));
    users.push({ ...account, id: user.id, client });
  }

  return users;
}

async function createDemoObjects(client) {
  const objectInputs = [
    { p_name: "Квартал «Сосновый»", p_address: "Екатеринбург, ул. Сосновая, 12" },
    { p_name: "Жилой дом на Мира", p_address: "Екатеринбург, ул. Мира, 24" },
    { p_name: "Офис «Речной»", p_address: "Екатеринбург, наб. Рабочей Молодёжи, 8" }
  ];

  const objectIds = [];

  for (const input of objectInputs) {
    objectIds.push(checked(await client.rpc("create_object", input)));
  }

  return objectIds;
}

async function createDemoTasks(manager, first, second, objectIds) {
  const definitions = [
    { title: "Проверить армирование перекрытия", object: 0, assignee: first, path: [] },
    { title: "Подготовить акт скрытых работ", object: 0, assignee: second, path: ["in_progress"] },
    { title: "Согласовать раскладку фасада", object: 0, assignee: first, path: ["in_progress", "in_review"] },
    {
      title: "Устранить замечания по входной группе",
      object: 1,
      assignee: first,
      path: ["in_progress", "in_review", "revision"]
    },
    {
      title: "Принять поставку окон",
      object: 1,
      assignee: second,
      path: ["in_progress", "in_review", "accepted"]
    },
    { title: "Проверить вентиляцию второго этажа", object: 2, assignee: second, path: [] }
  ];

  for (const definition of definitions) {
    const id = checked(
      await manager.client.rpc("create_task", {
        p_title: definition.title,
        p_description: "Выполнить проверку по рабочей документации и передать результат на согласование.",
        p_object_id: objectIds[definition.object],
        p_assignee_id: definition.assignee.id
      })
    );
    for (const [index, status] of definition.path.entries()) {
      const client =
        status === "accepted" || status === "revision" ? manager.client : definition.assignee.client;
      checked(
        await client.rpc("transition_task", {
          p_id: id,
          p_status: status,
          p_revision: index + 1,
          p_comment:
            status === "revision" ? "Устраните зазоры на примыканиях и отправьте задачу повторно." : ""
        })
      );
    }
  }
}

async function main() {
  validateConfiguration();

  const admin = createClient(url, secretKey, CLIENT_OPTIONS);

  await ensureEmptyProject(admin);

  const users = await createDemoUsers(admin);
  const [manager, first, second] = users;
  const objectIds = await createDemoObjects(manager.client);

  await createDemoTasks(manager, first, second, objectIds);
  await Promise.all(
    users.map(async user => {
      checked(await user.client.auth.signOut());
    })
  );

  console.log(
    "Созданы 3 пользователя, 3 объекта и 6 задач во всех статусах. Доступы сохранены в demo-credentials.txt."
  );
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : "Не удалось заполнить базу.");
  process.exitCode = 1;
});
