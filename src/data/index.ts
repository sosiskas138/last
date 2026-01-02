// Events
export { magnitEvents } from "./events/magnit-events";
export { pyaterochkaEvents } from "./events/pyaterochka-events";
export { lentaEvents } from "./events/lenta-events";
export { perekrestokEvents } from "./events/perekrestok-events";
export { okeyEvents } from "./events/okey-events";
export { magnoliaEvents } from "./events/magnolia-events";
export { kopeykaEvents } from "./events/kopeyka-events";
export { dixyEvents } from "./events/dixy-events";

// Financials
export { magnitFinancials } from "./financial/magnit-financials";
export { pyaterochkaFinancials } from "./financial/pyaterochka-financials";
export { lentaFinancials } from "./financial/lenta-financials";
export { perekrestokFinancials } from "./financial/perekrestok-financials";
export { okeyFinancials } from "./financial/okey-financials";
export { magnoliaFinancials } from "./financial/magnolia-financials";
export { kopeykaFinancials } from "./financial/kopeyka-financials";
export { dixyFinancials } from "./financial/dixy-financials";

// IPO
export { magnitIPO } from "./ipo/magnit-ipo";
export { pyaterochkaIPO } from "./ipo/pyaterochka-ipo";
export { lentaIPO } from "./ipo/lenta-ipo";
export { okeyIPO } from "./ipo/okey-ipo";
export { dixyIPO } from "./ipo/dixy-ipo";

// M&A
export { magnitMA } from "./ma/magnit-ma";
export { magnoliaMA } from "./ma/magnolia-ma";
export { dixyMA } from "./ma/dixy-ma";

// Founders
export { magnitFounders } from "./founders/magnit-founders";
export { pyaterochkaFounders } from "./founders/pyaterochka-founders";
export { lentaFounders } from "./founders/lenta-founders";
export { perekrestokFounders } from "./founders/perekrestok-founders";
export { okeyFounders } from "./founders/okey-founders";
export { magnoliaFounders } from "./founders/magnolia-founders";
export { kopeykaFounders } from "./founders/kopeyka-founders";
export { dixyFounders } from "./founders/dixy-founders";

// Aggregate all data
import { magnitEvents } from "./events/magnit-events";
import { pyaterochkaEvents } from "./events/pyaterochka-events";
import { lentaEvents } from "./events/lenta-events";
import { perekrestokEvents } from "./events/perekrestok-events";
import { okeyEvents } from "./events/okey-events";
import { magnoliaEvents } from "./events/magnolia-events";
import { kopeykaEvents } from "./events/kopeyka-events";
import { dixyEvents } from "./events/dixy-events";
import { magnitFinancials } from "./financial/magnit-financials";
import { pyaterochkaFinancials } from "./financial/pyaterochka-financials";
import { lentaFinancials } from "./financial/lenta-financials";
import { perekrestokFinancials } from "./financial/perekrestok-financials";
import { okeyFinancials } from "./financial/okey-financials";
import { magnoliaFinancials } from "./financial/magnolia-financials";
import { kopeykaFinancials } from "./financial/kopeyka-financials";
import { dixyFinancials } from "./financial/dixy-financials";
import { magnitIPO } from "./ipo/magnit-ipo";
import { pyaterochkaIPO } from "./ipo/pyaterochka-ipo";
import { lentaIPO } from "./ipo/lenta-ipo";
import { okeyIPO } from "./ipo/okey-ipo";
import { dixyIPO } from "./ipo/dixy-ipo";
import { magnitMA } from "./ma/magnit-ma";
import { magnoliaMA } from "./ma/magnolia-ma";
import { dixyMA } from "./ma/dixy-ma";
import { magnitFounders } from "./founders/magnit-founders";
import { pyaterochkaFounders } from "./founders/pyaterochka-founders";
import { lentaFounders } from "./founders/lenta-founders";
import { perekrestokFounders } from "./founders/perekrestok-founders";
import { okeyFounders } from "./founders/okey-founders";
import { magnoliaFounders } from "./founders/magnolia-founders";
import { kopeykaFounders } from "./founders/kopeyka-founders";
import { dixyFounders } from "./founders/dixy-founders";

export const allEvents = [...magnitEvents, ...pyaterochkaEvents, ...lentaEvents, ...perekrestokEvents, ...okeyEvents, ...magnoliaEvents, ...kopeykaEvents, ...dixyEvents];
export const allFinancials = [...magnitFinancials, ...pyaterochkaFinancials, ...lentaFinancials, ...perekrestokFinancials, ...okeyFinancials, ...magnoliaFinancials, ...kopeykaFinancials, ...dixyFinancials];
export const allIPO = [...magnitIPO, ...pyaterochkaIPO, ...lentaIPO, ...okeyIPO, ...dixyIPO];
export const allMA = [...magnitMA, ...magnoliaMA, ...dixyMA];
export const allFounders = [...magnitFounders, ...pyaterochkaFounders, ...lentaFounders, ...perekrestokFounders, ...okeyFounders, ...magnoliaFounders, ...kopeykaFounders, ...dixyFounders];
