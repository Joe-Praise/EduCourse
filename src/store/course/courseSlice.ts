import { createSlice } from '@reduxjs/toolkit';

// type user = {
// 	name: string;
// 	email: string;
// 	photo: string;
// 	role: string;
// 	createdAt: string;
// };

type courseState = {
	filterState: boolean;
};

const initialState: courseState = {
	filterState: false,
};

const courseSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setFilter: (state) => {
			state.filterState = !state.filterState;
		},
		// setUser: (state, action) => {
		// 	// state.token
		// },
	},
});

export const { setFilter } = courseSlice.actions;
export default courseSlice.reducer;
