import StatCard from "@/components/StatCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { subHours } from "date-fns";

export default function Stats() {
  const [orders, setOrder] = useState([]);
  useEffect(() => {
    axios.get("/api/orders").then((res) => setOrder(res.data));
  }, []);

  function ordersAmountTotal(orders) {
    let sum = 0;
    orders.forEach((o) => {
      o.line_items.forEach((li) => {
        sum += (li.quantity * li.price_data.unit_amount) / 100;
      });
    });
    return new Intl.NumberFormat("en-US").format(sum);
  }

  const ordersToday = orders.filter(
    (o) => new Date(o.createdAt) > subHours(new Date(), 24)
  );
  console.log(ordersToday);
  const ordersWeek = orders.filter(
    (o) => new Date(o.createdAt) > subHours(new Date(), 24 * 7)
  );
  const ordersMonth = orders.filter(
    (o) => new Date(o.createdAt) > subHours(new Date(), 24 * 30)
  );

  return (
    <div>
      <h2>Orders</h2>
      <div className={"grid grid-cols-2 sm:grid-cols-3 gap-2"}>
        <StatCard
          title="Daily"
          data={ordersToday.length}
          desc={`${ordersToday.length} orders today`}
        />
        <StatCard
          title="Monthly"
          data={ordersWeek.length}
          desc={`${ordersWeek.length} orders this week`}
        />
        <StatCard
          title="Yearly"
          data={ordersMonth.length}
          desc={`${ordersMonth.length} orders this month`}
        />
      </div>
      <h2 className={"mt-2"}>Revenue</h2>
      <div className={"grid grid-cols-2 sm:grid-cols-3 gap-4"}>
        <StatCard title="Daily" data={"$" + ordersAmountTotal(ordersToday)} />
        <StatCard title="Monthly" data={"$" + ordersAmountTotal(ordersWeek)} />
        <StatCard title="Yearly" data={"$" + ordersAmountTotal(ordersMonth)} />
      </div>
    </div>
  );
}
