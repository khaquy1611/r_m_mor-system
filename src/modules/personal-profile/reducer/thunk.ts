import { createAsyncThunk } from '@reduxjs/toolkit'

export const getPersonalProfileKpi = createAsyncThunk(
  'staff/getPersonalProfileKpi',
  async (payload: any, { rejectWithValue }) => {
    try {
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)
