import StatCard from "./StatCard";

export default function AdminStatsGrid({ stats, loading }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <StatCard
        icon="group"
        label="Usuarios"
        value={stats?.totalUsers}
        sub="↑ 12% este mes"
        loading={loading}
      />
      <StatCard
        icon="article"
        label="Posts"
        value={stats?.totalPosts}
        sub={`+ ${stats?.weekPosts ?? 0} nuevos esta semana`}
        loading={loading}
      />
      <StatCard
        icon="chat"
        label="Comentarios"
        value={stats?.totalComments}
        sub="Actualizado hace 5m"
        loading={loading}
      />
      <StatCard
        icon="calendar_month"
        label="Esta semana"
        value={stats?.weekPosts}
        sub="Objetivo cumplido"
        subGreen
        loading={loading}
      />
    </div>
  );
}
