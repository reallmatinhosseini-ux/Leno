import { Card, Chat, Return, Truck } from "./icons";
export default function Trust() {
  const items: [React.ReactNode, string, string][] = [[<Truck key="t" />, "Same-day delivery", "In Dubai, order by 2 pm"], [<Return key="r" />, "Free 14-day returns", "Collected from your door"], [<Card key="c" />, "Pay your way", "Apple Pay, cards, Tabby, Tamara"], [<Chat key="h" />, "Personal styling", "WhatsApp, 10 am to 10 pm"]];
  return <section className="g trust"><div className="w trust-in">{items.map(([i, b, s]) => <div data-fade key={b}>{i}<b>{b}</b><span>{s}</span></div>)}</div></section>;
}
