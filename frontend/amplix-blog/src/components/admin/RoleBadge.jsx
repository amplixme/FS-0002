export default function RoleBadge({ role }) {
  const styles = {
    ADMIN: "bg-primary text-white",
    COLLABORATOR: "bg-secondary-container text-on-secondary-container",
    USER: "bg-surface-container-high text-on-surface-variant",
  };

  const labels = {
    ADMIN: "Admin",
    COLLABORATOR: "Colaborador",
    USER: "Usuario",
  };

  return (
    <span
      className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${
        styles[role] ?? styles.USER
      }`}
    >
      {labels[role] ?? role}
    </span>
  );
}
