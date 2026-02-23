import type { Database, PinRepository } from "@repo/db";

export function makePinService(
    _repositories_: { pin: PinRepository },
    _db_: Database,
) {
    async function getAll() {
        return await _repositories_.pin.getAll();
    }

    async function getById(_id_: string) {
        return await _repositories_.pin.getById(_id_);
    }

    async function getByOwnerId(_ownerId_: string) {
        return await _repositories_.pin.getByOwnerId(_ownerId_);
    }

    async function getByStatus(_status_: string) {
        return await _repositories_.pin.getByStatus(_status_);
    }

    async function create(_data_: Parameters<typeof _repositories_.pin.create>[0]) {
        return await _repositories_.pin.create(_data_);
    }

    async function update(_id_: string, _data_: Parameters<typeof _repositories_.pin.update>[1]) {
        return await _repositories_.pin.update(_id_, _data_);
    }

    async function deleteById(_id_: string) {
        return await _repositories_.pin.deleteById(_id_);
    }

    return {
        getAll,
        getById,
        getByOwnerId,
        getByStatus,
        create,
        update,
        deleteById,
    };
}

export type PinService = ReturnType<typeof makePinService>;