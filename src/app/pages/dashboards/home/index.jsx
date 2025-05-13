// Local Imports
import { Page } from "components/shared/Page";
import { Progress } from "components/ui/Progress";
// import { Statistics } from "../Statistics";
// import { ProductsTable } from "../ProductsTable";
// import { TopSellers } from "../TopSellers";
// import { CurrentBalance } from "../CurrentBalance";
// import { TeamActivity } from "../TeamActivity";
// import { Transactions } from "../Transactions";
// import { CountrySource } from "../CountrySource";
// import { SocialSource } from "../SocialSource";

// ----------------------------------------------------------------------

export default function Sales() {
  const plans = [
    { name: 'Standard', sales: 1200 },
    { name: 'Business', sales: 3000 },
    { name: 'Entreprise', sales: 5800 },
  ];
  const clients = [
    { name: 'Client A', totalSales: 4200 },
    { name: 'Client B', totalSales: 1500 },
    { name: 'Client C', totalSales: 6700 },
  ];
  return (
    <Page title="Cumuled Dashboard">
      {/* <div className="transition-content overflow-hidden px-[--margin-x] pb-8">
        <Statistics />
        <div className="mt-4 grid grid-cols-12 gap-4 sm:mt-5 sm:gap-5 lg:mt-6 lg:gap-6">
          <ProductsTable />
          <div className="col-span-12 space-y-4 sm:col-span-6 sm:space-y-5 lg:col-span-4 lg:space-y-6 xl:col-span-3">
            <CurrentBalance />
            <TopSellers />
          </div>
          <TeamActivity />
          <div className="col-span-12 space-y-4 sm:col-span-6 sm:space-y-5 lg:col-span-4 lg:space-y-6">
            <SocialSource />
            <CountrySource />
          </div>
          <Transactions />
        </div>
      </div> */}

      <div className="transition-content overflow-hidden px-[--margin-x] pb-8">
        {/* Section 0 - Filtres */}
        <div className="flex gap-4 mb-6 justify-between mt-4">
<div> <p>Admin dashboards</p></div>

         <div className="">
         <select className="px-4 py-2 border rounded mr-2">
            <option>Secteur</option>
          </select>
          <select className="px-4 py-2 border rounded mr-2">
            <option>Forfait</option>
          </select>
          <select className="px-4 py-2 border rounded">
            <option>Année</option>
          </select>
         </div>
        </div>

        {/* Section 1 - Carte et Graphique */}
        <div className="grid grid-cols-12 gap-6 mb-6 " >
          <div className="col-span-6 ">
            <div className="bg-white p-4 rounded-lg shadow h-[290px]">
              <h3 className="text-lg font-semibold mb-4">Ventes par région</h3>
              {/* Composant Carte */}
            </div>
          </div>
          <div className="col-span-6 ">
            <div className="bg-white p-4 rounded-lg shadow h-[290px]">
              <h3 className="text-lg font-semibold mb-4">Ventes mensuelles</h3>
              {/* Composant Graphique mensuel */}
            </div>
          </div>
        </div>

          {/* Section 2 - Secteurs et Forfaits */}
          <div className="flex flex-nowrap gap-6 mb-6 pb-2 mt-10">
  <div className="flex-none w-[350px] ">
    <div className="bg-white p-4 rounded-lg shadow h-full">
      <h3 className="text-lg font-semibold mb-4">Ventes par secteur</h3>
      {/* Composant Barres de progression */}

      <Progress 
  value={80} 
  price=" €1200" 
  category="Technologie" 
  className="my-4"
/>
<Progress 
    value={70} 
    price=" €750" 
    category="Manufacturer" 
    className="my-4"
  />
   <Progress 
    value={40} 
    price=" €450" 
    category="Commerce" 
    className="my-4"
  />
  <Progress 
    value={30} 
    price="  €400" 
    category="Santé" 
     className="my-4"
    
  />

<Progress 
  value={25} 
  price=" €300" 
  category="Education" 
  className="my-4"
/>
    </div>
  </div>
  <div className="flex-none  w-[350px] ">
    <div className="bg-white p-4 rounded-lg shadow h-full">
      <h3 className="text-lg font-semibold mb-4">Ventes par forfaits</h3>
      {/* Composant Forfaits */}

      <div className="grid grid-cols-2 gap-4">
  <div>
    <h3 className="text-sm font-medium text-gray-500 mb-2 underline">Plan</h3>
    {plans.map((plan, index) => (
      <div key={index} className="py-1 text-base text-gray-700 border-b border-gray-200">
        {plan.name}
      </div>
    ))}
  </div>
  <div>
    <h3 className="text-sm font-medium text-gray-500 mb-2 underline text-right">Ventes</h3>
    {plans.map((plan, index) => (
      <div key={index} className="py-1 text-base text-gray-700 text-right border-b border-gray-200">
        {plan.sales}
      </div>
    ))}
  </div>
</div>
    </div>
  </div>
  
  <div className="flex-none  w-[350px] ">
    <div className="bg-white p-4 rounded-lg shadow ">
      <h3 className="text-lg font-semibold mb-4">Ventes totals</h3>
      {/* Composant Forfaits */}
      <p className="text-lg font-semibold mb-4 text-4xl">$890.00</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow  mt-2 h-[200px]">
      <h3 className="text-lg font-semibold mb-4">Ventes totals</h3>

      <div className="grid grid-cols-2 gap-4">
  <div>
    <h3 className="text-sm font-medium text-gray-500 mb-2 underline">Pralan</h3>
    {/* {plans.map((plan, index) => (
      <div key={index} className="py-1 text-base text-gray-700 border-b border-gray-200">
        {plan.name}
      </div>
    ))} */}
  </div>
  <div>
    <h3 className="text-sm font-medium text-gray-500 mb-2 underline text-right">$890.00</h3>
    {/* {plans.map((plan, index) => (
      <div key={index} className="py-1 text-base text-gray-700 text-right border-b border-gray-200">
        {plan.sales}
      </div>
    ))} */}
  </div>
</div>



      
    </div>
  </div>


  <div className="flex-none  w-[350px] ">
    <div className="bg-white p-4 rounded-lg shadow h-full">
      <h3 className="text-lg font-semibold mb-4">Principaux clients</h3>
      {/* Composant Forfaits */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2 underline">Client</h3>
          {clients.map((client, index) => (
            <div key={index} className="py-1 text-base text-gray-700 border-b border-gray-300">
              {client.name}
            </div>
          ))}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2 underline text-right">Vellets totales</h3>
          {clients.map((client, index) => (
            <div key={index} className="py-1 text-base text-gray-700 text-right border-b border-gray-300">
              {client.totalSales}
            </div>
          ))}
        </div>
      </div>

    </div>
  </div>
</div>

       
      </div>
    </Page>
  );
}
