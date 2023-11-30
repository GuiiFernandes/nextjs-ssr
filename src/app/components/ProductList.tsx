import Link from 'next/link';
import Image from 'next/image';

import { PaginationProduct } from '../models';
import makeSearchLink from "../utils";

const getProducts = async ({name, page}: {name?: string, page?: number}): Promise<PaginationProduct> => {
  const searchParams = new URLSearchParams();
  if (name) {
    searchParams.append('name', name);
  }

  if (page && page > 1) {
    searchParams.append('page', page.toString());
  }

  const response = await fetch(
    `http://localhost:8000/products?${searchParams}`,
    {
      cache: 'no-store',
      // next: {
      //   revalidate: 10,
      // },
    },
  );
  return response.json();
};

export default async function ProductList({
  name, page
}: { name?: string, page: number }) {
  const dataProducts = await getProducts({ name, page });
  const { products } = dataProducts;
  const totalPages = Math.ceil(dataProducts.total / 15);
  return (
    <>
      <nav className="flex justify-center mb-2 w-full">
        <ul className="pagination flex flex-row gap-3 w-[80%] justify-between">
          <li className="pagination-item">
            <div className="w-20">
              { page !== 1 && (
                <Link href={makeSearchLink({name, page: page - 1})}>
                  &laquo; Anterior
                </Link>
              )}
            </div>
          </li>
          {new Array(totalPages).fill(0).map((_, index) => (
            <li className="pagination-item" key={index}>
              <Link href={makeSearchLink({name, page: index + 1})}>
                {index + 1}
              </Link>
            </li>
          ))}
          <li className="pagination-item">
            <div className="w-20">
              { page !== totalPages && (
                <Link href={makeSearchLink({name, page: page + 1})}>
                  Próximo &raquo;
                </Link>
              )}
            </div>
          </li>
        </ul>
      </nav>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        { products.map(({ id, name, image_url, price }) => (
          <div key={ id } className="bg-white p-4 rounded shadow">
            <Image src={ image_url } alt={name} width={150} height={150} />
            <h2 className="text-lg text-black font-semibold">
              { name }
            </h2>
            <div className="text-blue-600 font-bold">
              {Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(price)}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
