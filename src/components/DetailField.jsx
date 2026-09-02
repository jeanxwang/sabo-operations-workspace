export default function DetailField({ label, value }) {
  const isEmpty = value === "" || value === null || value === undefined;

  return (
    <div className="detail-field">
      <span className="detail-field-label">{label}</span>
      <span className={isEmpty ? "detail-field-value empty" : "detail-field-value"}>
        {isEmpty ? "—" : value}
      </span>
    </div>
  );
}