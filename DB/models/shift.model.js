import {Schema,model,Types} from "mongoose";

const shiftSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Shift name is required"],
            trim: true
        },
        startTime: {
            type: Date, // Store time as a String object (only using the time part)
            required: [true, "Shift start time is required"]
        },
        endTime: {
            type: Date, // Store time as a String object
            required: [true, "Shift end time is required"]
        },
        department: {
            type:Types.ObjectId,
            ref: "Department",
            required: [true, "Department is required"]
        },
        employees: [
            {
                type: Types.ObjectId,
                ref: "User"
            }
        ],
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

const ShiftModel = model("Shift", shiftSchema);

export default ShiftModel;
