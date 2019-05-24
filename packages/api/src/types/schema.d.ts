// tslint:disable
// graphql typescript definitions

declare namespace GQL {
interface IGraphQLResponseRoot {
data?: IQuery | IMutation;
errors?: Array<IGraphQLResponseError>;
}

interface IGraphQLResponseError {
/** Required for all errors */
message: string;
locations?: Array<IGraphQLResponseErrorLocation>;
/** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
[propName: string]: any;
}

interface IGraphQLResponseErrorLocation {
line: number;
column: number;
}

interface IQuery {
__typename: "Query";
hello: string | null;
}

interface IMutation {
__typename: "Mutation";
login: IGenericPayload;
register: IGenericPayload;
}

interface ILoginOnMutationArguments {
email: string;
password: string;
}

interface IRegisterOnMutationArguments {
email: string;
password: string;
username: string;
}

interface IGenericPayload {
__typename: "GenericPayload";
path: string;
message: string;
success: boolean;
}

interface IUser {
__typename: "User";
id: string;
email: string;
username: string;
}
}

// tslint:enable
