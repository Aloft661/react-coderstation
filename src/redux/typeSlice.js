import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getType } from "../api/type";

export const getTypeList = createAsyncThunk(
    "type/get",
    async () => {
        const resp = await getType();
        return resp.data;
    }
);

const typeSlice = createSlice({
    name: "type",
    initialState: {
        typeList: [],
    },
    reducers: {
        
    },
    extraReducers: (builder) => {   
        builder.addCase(getTypeList.fulfilled, (state, { payload }) => {
            state.typeList = payload;
        });
    }
});

export default typeSlice.reducer;