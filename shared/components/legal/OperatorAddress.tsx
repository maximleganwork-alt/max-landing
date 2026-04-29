import type { LegalEntity } from "../../lib/legal-entity";

export function OperatorAddress({ entity }: { entity: LegalEntity }) {
  return (
    <address className="not-italic">
      {entity.legalName}
      <br />
      ИНН: {entity.inn}
      <br />
      ОГРНИП: {entity.ogrnip}
      <br />
      Адрес: {entity.address}
      <br />
      Email:{" "}
      <a
        href={`mailto:${entity.contactEmail}`}
        className="text-primary hover:underline underline-offset-2"
      >
        {entity.contactEmail}
      </a>
    </address>
  );
}
