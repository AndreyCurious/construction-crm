import type { TaskStatus } from "@/shared/model/crm.types";

import { DEMO_ACCOUNTS } from "./demo.accounts";

type DemoTaskDefinition = {
  title: string;
  description: string;
  object: number;
  assignee: string;
  statuses: TaskStatus[];
};

const [, first, second] = DEMO_ACCOUNTS;

export const DEMO_OBJECTS = [
  {
    id: "20000000-0000-4000-8000-000000000001",
    name: "Квартал «Сосновый»",
    address: "Екатеринбург, ул. Сосновая, 12"
  },
  {
    id: "20000000-0000-4000-8000-000000000002",
    name: "Жилой дом на Мира",
    address: "Екатеринбург, ул. Мира, 24"
  },
  {
    id: "20000000-0000-4000-8000-000000000003",
    name: "Офис «Речной»",
    address: "Екатеринбург, наб. Рабочей Молодёжи, 8"
  }
];

export const DEMO_TASKS: DemoTaskDefinition[] = [
  {
    title: "Проверить армирование перекрытия",
    description:
      "Проверить диаметр и шаг арматуры на третьем этаже. Сверить результат с рабочей документацией.",
    object: 0,
    assignee: first.id,
    statuses: ["new"]
  },
  {
    title: "Подготовить акт скрытых работ",
    description: "Подготовить акт по гидроизоляции подземной части корпуса 2.",
    object: 0,
    assignee: second.id,
    statuses: ["new", "in_progress"]
  },
  {
    title: "Согласовать раскладку фасада",
    description: "Проверить раскладку облицовочного кирпича и передать результат руководителю.",
    object: 0,
    assignee: first.id,
    statuses: ["new", "in_progress", "in_review"]
  },
  {
    title: "Устранить замечания по входной группе",
    description: "Проверить примыкания дверного блока и качество отделки откосов.",
    object: 1,
    assignee: first.id,
    statuses: ["new", "in_progress", "in_review", "revision"]
  },
  {
    title: "Принять поставку окон",
    description: "Сверить количество и маркировку окон с ведомостью поставки.",
    object: 1,
    assignee: second.id,
    statuses: ["new", "in_progress", "in_review", "accepted"]
  },
  {
    title: "Проверить вентиляцию второго этажа",
    description: "Проверить монтаж воздуховодов и доступ к ревизионным люкам.",
    object: 2,
    assignee: second.id,
    statuses: ["new"]
  }
];
