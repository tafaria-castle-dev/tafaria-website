import { BoardType, LeisureRoom, Residency, Room } from '@/types/types';

export const getBoardTypeKey = (
    type: BoardType,
): keyof Room['rates']['single'] => {
    switch (type) {
        case 'FB':
            return 'full_board';
        case 'HB':
            return 'half_board';
        case 'BB':
            return 'bnb';
        default:
            return 'full_board';
    }
};

export const getCurrencyKey = (res: Residency): 'kshs' | 'usd' => {
    return res === 'East African Resident' ? 'kshs' : 'usd';
};

export const getSupplement = (res: Residency, isAdult: boolean): number => {
    return res === 'East African Resident'
        ? isAdult
            ? 4000
            : 2000
        : isAdult
          ? 30
          : 10;
};

export const getKidsMealCost = (
    boardType: BoardType,
    residency: Residency,
): number => {
    const isResident = residency === 'East African Resident';
    const fb = isResident ? 6000 : 46;
    const hb = isResident ? 4600 : 35;
    const bb = isResident ? 3000 : 23;
    switch (boardType) {
        case 'FB':
            return fb;
        case 'HB':
            return hb;
        case 'BB':
            return bb;
    }
};

export const getRoomRate = (
    room: Room | LeisureRoom,
    type: BoardType,
    res: Residency,
    occupancy: 'Single' | 'Double',
): number => {
    const boardKey = getBoardTypeKey(type);
    const currencyKey = getCurrencyKey(res);
    return room.rates[occupancy.toLowerCase() as 'single' | 'double'][boardKey][
        currencyKey
    ];
};
