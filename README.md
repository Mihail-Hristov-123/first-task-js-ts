# E-commerce store

## Implemented features

- Singleton store service, exposing the base functionalities of the app
- Inheritance - the abstract customer is extended by the premium and regular customer classes
- Generator - iterable customers - shows the products in a customer's cart
- Usage of Utility types - Pick, Omit, Record
- Initial fetch of the products from the provided API
- Payment simulation with a timeout
- Usage of TypeORM decorators - Entity, Column, ManyToOne, ManyToMany, JoinTable
- Customer behavior depends on the premium subscription - access to limited items, discounts

### Instructions

- Please include the connection string (will be provided in task submission) in the env file - I am using a remote DB
- index.ts is the entry point of the app, npm run start will handle compilation and the demo
