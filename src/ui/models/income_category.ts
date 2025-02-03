export class IncomeCategory {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public createdAt: Date,
        public updatedAt: Date
    ) {}

    toJson(): {} {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }

    static fromJson(json: IncomeCategory): IncomeCategory {
        return new IncomeCategory(
            json.id!,
            json.name,
            json.description!,
            json.createdAt,
            json.updatedAt
        );
    }
}