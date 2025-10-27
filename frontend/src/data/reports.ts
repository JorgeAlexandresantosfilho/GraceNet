import type { Relatorio } from "../types";
import { DollarSign, Users, BarChart3, TrendingUp } from "lucide-react";

export const relatorios: Relatorio[] = [
  {
    id: "financial",
    title: "Relatório Financeiro",
    description: "Receitas, pagamentos e inadimplência",
    icon: DollarSign,
    color: "green",
  },
  {
    id: "customers",
    title: "Relatório de Clientes",
    description: "Base de clientes e crescimento",
    icon: Users,
    color: "blue",
  },
  {
    id: "network",
    title: "Performance da Rede",
    description: "Velocidade, uptime e qualidade",
    icon: BarChart3,
    color: "purple",
  },
  {
    id: "growth",
    title: "Crescimento do Negócio",
    description: "Métricas de expansão e tendências",
    icon: TrendingUp,
    color: "orange",
  },
];
