// product-cart.dto.ts
export class ProductCartDto {
    mem_code: string;

    cart: {
        spc_amount: number;
        spc_check: '0' | '1';
    };

    products: {
        pro_code: string;
        pro_name: string;
        pro_imagemain: string;
        pro_priceA: number;
        pro_priceB: number;
        pro_priceC: number;
        pro_unit1: string;
        pro_ratio1: number;
        pro_unit2: string;
        pro_ratio2: number;
        pro_unit3: string;
        pro_ratio3: number;
    };
}
