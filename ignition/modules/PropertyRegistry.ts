import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const PropertyRegistryModule = buildModule(
  "PropertyRegistryModule",
  (m) => {
    const propertyRegistry = m.contract("PropertyRegistry");

    return {
      propertyRegistry,
    };
  }
);

export default PropertyRegistryModule;