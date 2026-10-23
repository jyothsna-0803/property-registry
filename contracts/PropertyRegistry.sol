// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PropertyRegistry {
    struct Property {
        string propertyAddress;
        address owner;
        uint256 price;
    }

    mapping(uint256 => Property) public properties;

    uint256 private nextPropertyId;

    event PropertyRegistered(
        uint256 indexed propertyId,
        address indexed owner,
        string propertyAddress,
        uint256 price
    );

    event OwnershipTransferred(
        uint256 indexed propertyId,
        address indexed previousOwner,
        address indexed newOwner
    );

    function registerProperty(
        string memory _address,
        uint256 _price
    ) public {
        properties[nextPropertyId] = Property(
            _address,
            msg.sender,
            _price
        );

        emit PropertyRegistered(
            nextPropertyId,
            msg.sender,
            _address,
            _price
        );

        nextPropertyId++;
    }

    function transferOwnership(
        uint256 _propertyId,
        address newOwner
    ) public {
        require(
            _propertyId < nextPropertyId,
            "Property does not exist"
        );

        require(
            properties[_propertyId].owner == msg.sender,
            "Only the owner can transfer ownership"
        );

        require(
            newOwner != address(0),
            "New owner cannot be zero address"
        );

        address previousOwner = properties[_propertyId].owner;

        properties[_propertyId].owner = newOwner;

        emit OwnershipTransferred(
            _propertyId,
            previousOwner,
            newOwner
        );
    }

    function getProperty(
        uint256 _propertyId
    )
        public
        view
        returns (
            string memory propertyAddress,
            address owner,
            uint256 price
        )
    {
        require(
            _propertyId < nextPropertyId,
            "Property does not exist"
        );

        Property memory property = properties[_propertyId];

        return (
            property.propertyAddress,
            property.owner,
            property.price
        );
    }
}