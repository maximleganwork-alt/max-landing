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
}

/**
 * ⚠️ ВНИМАНИЕ: ВСЕ ЗНАЧЕНИЯ НИЖЕ — ЗАГЛУШКИ.
 *
 * Перед публикацией в production ОБЯЗАТЕЛЬНО заменить на реальные реквизиты
 * оператора персональных данных. Публикация Политики конфиденциальности и
 * Согласия на обработку ПДн с фейковыми реквизитами квалифицируется РКН как
 * представление недостоверных сведений (ч.1 ст.13.11 КоАП — до 100 тыс. руб.,
 * для ИП до 50 тыс. руб.).
 *
 * Также перед сбором ПДн в production требуется:
 *   1) подача уведомления в реестр операторов ПДн на pd.rkn.gov.ru (ст. 22 152-ФЗ);
 *   2) отдельное уведомление о трансграничной передаче ПДн в Telegram
 *      (ст. 12 152-ФЗ, действует с 01.03.2023).
 */
export const legalEntity: LegalEntity = {
  brand: "BotMax",
  legalName: "ИП Иванов Иван Иванович",
  inn: "123456789012",
  ogrnip: "123456789012345",
  address: "123456, г. Москва, ул. Примерная, д. 1",
  contactEmail: "hello@example.ru",
  policyDate: "27 апреля 2026 г.",
  policyRevision: 1,
};
