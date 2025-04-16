import {Schema,model,Types} from "mongoose";

const departmentSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Department name is required"],
            unique: true,
            trim: true
        }
        },
    { timestamps: true } // Adds createdAt & updatedAt fields
);


// Virtual field to get employees in this department
departmentSchema.virtual("employees", {
    ref: "User",
    localField: "_id",
    foreignField: "departmentId",
});

departmentSchema.set("toJSON", { virtuals: true });
departmentSchema.set("toObject", { virtuals: true });


const DepartmentModel = model("Department", departmentSchema);

export default DepartmentModel;
