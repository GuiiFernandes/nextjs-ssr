import { Suspense } from "react";
import ProductList from "../components/ProductList";
import makeSearchLink from "../utils";
import Loading from "../components/Loading";

export default async function ProductsListPage({
  searchParams,
}: { searchParams: { name?: string, page?: string }}) {
  const { name } = searchParams;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  
  return (
    <div className="m-3">
      <form action={makeSearchLink({page: 1})} method="get">
        <input 
        className="border text-black border-gray-400 px-4 py-2 rounded"
        type="search"
        name="name"
        placeholder="Pesquisar..."
        defaultValue={name}
      />
        <button type="submit">Pesquisar</button>
      </form>
      <div className="container mt-8">
        <h1 className="text-2xl font-bold">Lista de produtos</h1>
        <Suspense fallback={<Loading />}>
          <ProductList name={name} page={page} />
        </Suspense>
      </div>
    </div>
  )
}
