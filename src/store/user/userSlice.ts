import { createSlice } from '@reduxjs/toolkit';

type user = {
	name: string;
	email: string;
	photo: string;
	role: string;
	createdAt: string;
};

type userState = {
	userObj: user;
	token: string;
};

const initialState: userState = {
	userObj: {
		name: '',
		email: '',
		photo: '',
		role: '',
		createdAt: '',
	},
	token: '',
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		// setUser: (state, action) => {
		// 	// state.token =
		// },
	},
});

export default userSlice.reducer;
