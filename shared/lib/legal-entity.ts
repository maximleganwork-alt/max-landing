/**
 * Legal entity (operator of personal data) for all sites of the studio.
 * Single source of truth: change once → applies to /privacy and /consent on every frontend.
 */
export interface LegalEntity {
  brand: string;
  legalName: string;
  inn: string;
  ogrnip: string;
  address: string;
  contactEmail: string;
  policyDate: string;
  policyRevision: number;
  /** Банковские реквизиты — публикуются в Договоре-оферте. */
  bank: {
    account: string;
    name: string;
    inn: string;
    bik: string;
    corrAccount: string;
    address: string;
  };
}

/**
 * Перед сбором ПДн в production требуется:
 *   1) подача уведомления в реестр операторов ПДн на pd.rkn.gov.ru (ст. 22 152-ФЗ);
 *   2) отдельное уведомление о трансграничной передаче ПДн в Telegram
 *      (ст. 12 152-ФЗ, действует с 01.03.2023).
 *
 * `brand` и `contactEmail` — пока плейсхолдеры. Заменить перед запуском.
 */
export const legalEntity: LegalEntity = {
  brand: "BotMax",
  legalName: "ИП Леган Максим Артёмович",
  inn: "910231127118",
  ogrnip: "326911200028942",
  address: "295050, Республика Крым, г. Симферополь, ул. Никанорова, д. 4Б, кв. 75",
  contactEmail: "hello@example.ru",
  policyDate: "30 апреля 2026 г.",
  policyRevision: 2,
  bank: {
    account: "40802810500009464250",
    name: "АО «ТБанк»",
    inn: "7710140679",
    bik: "044525974",
    corrAccount: "30101810145250000974",
    address: "127287, г. Москва, ул. Хуторская 2-я, д. 38А, стр. 26",
  },
};
