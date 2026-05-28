import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios"

const API_URL = "http://localhost:5000/api";

export const createAssignment = createAsyncThunk("assignments/create", async (formData: FormData) => {
  const response = await axios.post(`${API_URL}/assignments`, formData);
  return response.data;
});

export const fetchAssignments = createAsyncThunk("assignments/fetchAll", async () => {
  const response = await axios.get(`${API_URL}/assignments`);
  return response.data;
});

interface QuestionType {
  type: string;
  count: number;
  marks: number;
}

interface AssignmentState {
  assignments: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  formData: {
    title: string;
    dueDate: string;
    questionTypes: QuestionType[];
    instructions: string;
    fileName: string | null;
  }
}

const initialState: AssignmentState = {
  assignments: [],
  status: "idle",
  error: null,
  formData: {
    title: "",
    dueDate: "",
    questionTypes: [{ type: "Multiple Choice Questions", count: 4, marks: 1 }],
    instructions: "",
    fileName: null,
  }
}

const assignmentSlice = createSlice({
  name: "assignemnts",
  initialState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.formData.title = action.payload;
    },
    setDueDate: (state, action: PayloadAction<string>) => {
      state.formData.dueDate = action.payload;
    },
    setInstructions: (state, action: PayloadAction<string>) => {
      state.formData.instructions = action.payload;
    },
    setFileName: (state, action: PayloadAction<string>) => {
      state.formData.fileName = action.payload;
    },
    addQuestionType: (state) => {
      state.formData.questionTypes.push({ type: "Short Questions", count: 3, marks: 2 });
    },
    removeQuestionType: (state, action: PayloadAction<number>) => {
      state.formData.questionTypes.splice(action.payload, 1);
    },
    updateQuestionType: (state, action: PayloadAction<{ index: number; field: string; value: any }>) => {
      const { index, field, value } = action.payload;
      (state.formData.questionTypes[index] as any)[field] = value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAssignment.pending, (state) => { state.status = "loading"; })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.assignments.push(action.payload);
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to create assignment";
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.assignments = action.payload;
      });
  },
});

export const { setTitle, setDueDate, setInstructions, setFileName, addQuestionType, removeQuestionType, updateQuestionType } = assignmentSlice.actions;
export default assignmentSlice.reducer;
