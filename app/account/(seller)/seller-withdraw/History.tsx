import React, { FC } from "react";

const History: FC<{ transactions: any[] }> = ({ transactions }) => {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Transaction History</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Reason</th>
              <th className="border border-gray-300 px-4 py-2">
                Previous Amount
              </th>
              <th className="border border-gray-300 px-4 py-2">
                Recent Transaction
              </th>
              <th className="border border-gray-300 px-4 py-2">
                Current Total
              </th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction: any) => (
              <tr key={transaction._id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">
                  {transaction.reasonOfTransaction}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {transaction.previousAmount}
                </td>
                <td
                  className={`${
                    transaction.recentAmount < 0 && "text-red-500"
                  } border border-gray-300 px-4 py-2 `}
                >
                  {transaction.recentAmount}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {transaction.currentTotal}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(transaction.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
