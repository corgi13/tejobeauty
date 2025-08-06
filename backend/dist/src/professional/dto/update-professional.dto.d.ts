import { CreateProfessionalDto } from "./create-professional.dto";
declare const UpdateProfessionalDto_base: import("@nestjs/common").Type<Partial<CreateProfessionalDto>>;
export declare class UpdateProfessionalDto extends UpdateProfessionalDto_base {
    isVerified?: boolean;
}
export {};
