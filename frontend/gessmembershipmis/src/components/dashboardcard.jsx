export default function DashboardCard({ title, description }) {
  return (
    <div className="card">
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
}
