export type LoginRequest = {
	email: string;
	password: string;
};
export type SignupRequest = {
	email: string;
	password: string;
};
export type TokenResponse = {
	access_token: string;
	refresh_token: string;
	access_token_expires_in: number;
	refresh_token_expires_in: number;
	user: UserDto;
};
export type UserDto = {
	id: string;
	email: string;
};
