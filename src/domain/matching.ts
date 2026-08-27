import {Provider} from "../types/provider"

export function findProvidersByZip(providers: Provider[], zip:string):Provider[]{
  return providers.filter(p => p.serviceAreaZipCodes.includes(zip));
}

export function getProviderContact(provider?: Provider): string {
  return provider?.phone ?? "No phone on file";
}


const providerWithPhone: Provider = {
  id: "p1",
  name: "Sunrise Lawn Care",
  email: "contact@sunriselawn.com",
  phone: "555-201-4477",
  serviceAreaZipCodes: ["63108", "63110"],
  servicesOffered: ["mowing", "edging"],
};

const providerWithoutPhone: Provider = {
  id: "p2",
  name: "GreenScape Mowing",
  email: "hello@greenscapemowing.com",
  serviceAreaZipCodes: ["63108"],
  servicesOffered: ["mowing"],
};

console.log(getProviderContact(providerWithPhone));    
console.log(getProviderContact(providerWithoutPhone)); 
console.log(getProviderContact(undefined));             