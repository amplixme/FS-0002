export default function RoleBadge({ role }) {
  return (
    <span
      className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${
        role === "ADMIN"
          ? "bg-primary text-white"
          : "bg-surface-container-high text-on-surface-variant"
      }`}
    >
      {role}
    </span>
  );
}
