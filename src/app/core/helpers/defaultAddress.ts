import { Address } from "../models/address.model";

export function getDefaultAddress(addresses : Address[]) : Address | null
{
    return addresses.find(a => a.default) ?? null

}

export function addressToString(address : Address)
{
  return `${address.city}, ${address.department}, ${address.addressLine}`;
}
