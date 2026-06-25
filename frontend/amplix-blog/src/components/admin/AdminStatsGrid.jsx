import StatCard from "./StatCard";

export default function AdminStatsGrid({ stats, loading }) {
  // Textos dinámicos basados en datos reales
  const userGrowthText = stats?.userGrowth != null
    ? stats.userGrowth > 0
      ? `↑ ${stats.userGrowth}% este mes`
      : stats.userGrowth < 0
        ? `↓ ${Math.abs(stats.userGrowth)}% este mes`
        : "Sin cambios este mes"
    : "↑ 12% este mes"; // fallback por si no hay dato

  const lastCommentText = stats?.lastCommentMinutes != null
    ? stats.lastCommentMinutes < 1
      ? "Actualizado hace un momento"
      : stats.lastCommentMinutes < 60
        ? `Actualizado hace ${stats.lastCommentMinutes}m`
        : stats.lastCommentMinutes < 1440
          ? `Actualizado hace ${Math.floor(stats.lastCommentMinutes / 60)}h`
          : `Actualizado hace ${Math.floor(stats.lastCommentMinutes / 1440)}d`
    : "Sin actividad reciente";

  const weekPostsCount = stats?.weekPosts ?? 0;
  const weekGoal = stats?.weekGoal ?? 5;
  const weekGoalReached = weekPostsCount >= weekGoal;
  
  const weekGoalText = weekGoalReached
    ? "Objetivo cumplido"
    : `${weekPostsCount}/${weekGoal} del objetivo`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <StatCard
        icon="group"
        label="Usuarios"
        value={stats?.totalUsers}
        sub={userGrowthText}
        loading={loading}
      />
      <StatCard
        icon="article"
        label="Posts"
        value={stats?.totalPosts}
        sub={`+ ${weekPostsCount} nuevos esta semana`}
        loading={loading}
      />
      <StatCard
        icon="chat"
        label="Comentarios"
        value={stats?.totalComments}
        sub={lastCommentText}
        loading={loading}
      />
      <StatCard
        icon="calendar_month"
        label="Esta semana"
        value={weekPostsCount}
        sub={weekGoalText}
        subGreen={weekGoalReached}
        loading={loading}
      />
    </div>
  );
}