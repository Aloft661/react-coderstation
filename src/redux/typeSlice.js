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
        issueTypeId: "all",
        bookTypeId: "all"
    },
    reducers: {
        updateIssueTypeId: (state, {payload}) => {
            state.issueTypeId = payload;
        }
    },
    extraReducers: (builder) => {   
        builder.addCase(getTypeList.fulfilled, (state, { payload }) => {
            state.typeList = payload;
        });
    }
});

export const { updateIssueTypeId } = typeSlice.actions;
export default typeSlice.reducer;