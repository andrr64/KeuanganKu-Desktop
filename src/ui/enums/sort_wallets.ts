import { DropdownItemInterface } from "../views/components/Dropdown";

export enum EnumSortWalletsBy {
    DATE_ASC = 'Newest',
    Date_DESC = 'Oldest',
    Balance_ASC = 'Lowest Balance',
    Balance_DESC = 'Highest Balance',
    Alphabetic_ASC = 'Name A-Z',
    Alphabetic_DESC = 'Name Z-A'
}

export const sortWalletsByDropdownItems: DropdownItemInterface<EnumSortWalletsBy>[] = [
    { label: EnumSortWalletsBy.DATE_ASC, value: EnumSortWalletsBy.DATE_ASC },
    { label: EnumSortWalletsBy.Date_DESC, value: EnumSortWalletsBy.Date_DESC },
    { label: EnumSortWalletsBy.Balance_ASC, value: EnumSortWalletsBy.Balance_ASC },
    { label: EnumSortWalletsBy.Balance_DESC, value: EnumSortWalletsBy.Balance_DESC },
    { label: EnumSortWalletsBy.Alphabetic_ASC, value: EnumSortWalletsBy.Alphabetic_ASC },
    { label: EnumSortWalletsBy.Alphabetic_DESC, value: EnumSortWalletsBy.Alphabetic_DESC }
];