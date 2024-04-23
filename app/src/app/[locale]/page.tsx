import { HomePage } from "@/compoents/pages";
import { GETQUERY } from "@/query/schema";
import { getClient } from "@/lib/server";

export default async function Home() {
  const { loading, error, data } = await getClient().query({ query: GETQUERY });
  console.log(data.todos.data, 'data')
  return <HomePage />;
}
