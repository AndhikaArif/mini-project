type Props = {
  transaction: {
    quantity: number;
    totalAmount: number;
    status: string;
    createdAt: string;
    event: { name: string };
    customer: { name: string; email: string };
  };
};

export default function TransactionRow({ transaction }: Props) {
  return (
    <tr>
      <td className="border px-3 py-2">{transaction.event.name}</td>

      <td className="border px-3 py-2">
        <p className="font-medium">{transaction.customer.name}</p>
        <p className="text-sm text-gray-500">{transaction.customer.email}</p>
      </td>

      <td className="border px-3 py-2 text-center">{transaction.quantity}</td>

      <td className="border px-3 py-2">
        Rp {transaction.totalAmount.toLocaleString("id-ID")}
      </td>

      <td className="border px-3 py-2">{transaction.status}</td>

      <td className="border px-3 py-2">
        {new Date(transaction.createdAt).toLocaleDateString("id-ID")}
      </td>
    </tr>
  );
}
