export function formatRelativeTime(dateString) {
  if (!dateString || isNaN(new Date(dateString).getTime())) {
    return "fecha desconocida";
  }

  const date = new Date(dateString);
  const now = new Date();
  const secondsPast = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (secondsPast < 60) return "hace unos segundos";

  if (secondsPast < 3600) {
    const minutes = Math.floor(secondsPast / 60);
    return `hace ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
  }

  if (secondsPast < 86400) {
    const hours = Math.floor(secondsPast / 3600);
    return `hace ${hours} ${hours === 1 ? "hora" : "horas"}`;
  }

  if (secondsPast < 2592000) {
    const days = Math.floor(secondsPast / 86400);
    return `hace ${days} ${days === 1 ? "día" : "días"}`;
  }

  const months = Math.floor(secondsPast / 2592000);
  return `hace ${months} ${months === 1 ? "mes" : "meses"}`;
}
