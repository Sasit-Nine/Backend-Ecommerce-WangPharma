export class UpdateCartDto {
    spc_check?: '0' | '1';
    spc_amount?: number;
    select_all?: boolean;
    mem_id?: number; // เพิ่ม mem_id เพื่อ filter เวลาจะ update ทั้งหมด
}