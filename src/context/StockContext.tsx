import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import {
  Location, EpiItem, EpiKit, StockMovement, MovementType,
  KitAvailability, KitLimitingItem, BatchMovementEntry, AppUser,
} from '../types';
import * as api from '../services/api';

// ── Types ───────────────────────────────────────────────────────────────────

interface StockContextType {
  locations: Location[];
  items: EpiItem[];
  kits: EpiKit[];
  movements: StockMovement[];
  users: AppUser[];
  isLoading: boolean;
  currentUserId: string;
  currentUser: AppUser;
  selectedLocationId: string | 'ALL';
  setSelectedLocationId: (id: string | 'ALL') => void;

  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;

  addUser: (user: Omit<AppUser, 'id' | 'createdAt'>) => Promise<AppUser>;
  updateUser: (id: string, user: Partial<AppUser>) => Promise<void>;
  deleteUser: (id: string) => Promise<{ success: boolean; message?: string }>;
  setCurrentUserId: (id: string) => void;

  isCurrentUserAdmin: boolean;
  isCurrentUserController: boolean;
  isCurrentUserViewer: boolean;
  canEditStock: (targetLocationId?: string) => boolean;
  canManageUsers: boolean;
  canManageLocations: boolean;
  userAccessibleLocations: Location[];

  addLocation: (location: Omit<Location, 'id' | 'createdAt'>) => Promise<Location>;
  updateLocation: (id: string, location: Partial<Location>) => Promise<void>;
  deleteLocation: (id: string) => Promise<{ success: boolean; message?: string }>;

  addItem: (item: Omit<EpiItem, 'id' | 'updatedAt'>) => Promise<EpiItem>;
  updateItem: (id: string, item: Partial<EpiItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;

  registerSingleMovement: (params: {
    itemId: string; type: MovementType; quantity: number; reason: string;
    employeeName?: string; employeeRole?: string; employeeRegistration?: string; notes?: string;
  }) => Promise<{ success: boolean; error?: string }>;

  registerBatchMovement: (params: {
    locationId: string; entries: BatchMovementEntry[]; reason: string;
    employeeName?: string; employeeRole?: string; employeeRegistration?: string;
    isDailyClosing?: boolean; notes?: string;
  }) => Promise<{ success: boolean; count: number; error?: string }>;

  transferStock: (params: {
    sourceItemId: string; targetLocationId: string; quantity: number; reason: string; notes?: string;
  }) => Promise<{ success: boolean; error?: string }>;

  addKit: (kit: Omit<EpiKit, 'id' | 'createdAt' | 'updatedAt'>) => Promise<EpiKit>;
  updateKit: (id: string, kit: Partial<EpiKit>) => Promise<void>;
  deleteKit: (id: string) => Promise<void>;
  deliverKit: (params: {
    kitId: string; locationId: string; quantityOfKits: number;
    employeeName?: string; employeeRole?: string; employeeRegistration?: string; notes?: string;
  }) => Promise<{ success: boolean; error?: string }>;

  getKitAvailabilityForLocation: (kitId: string, locationId: string) => KitAvailability | null;
  getAllKitsAvailability: (locationId?: string) => KitAvailability[];

  resetToDefaultData: () => void;
  exportBackupJSON: () => string;
  importBackupJSON: (jsonString: string) => boolean;
}

const EMPTY_USER: AppUser = {
  id: '', name: 'Carregando...', email: '', role: 'VIEWER',
  locationIds: ['ALL'], status: 'ATIVO', createdAt: '',
};

const StockContext = createContext<StockContextType | undefined>(undefined);

// ── Provider ─────────────────────────────────────────────────────────────────

export const StockProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [locations, setLocations] = useState<Location[]>([]);
  const [items, setItems] = useState<EpiItem[]>([]);
  const [kits, setKits] = useState<EpiKit[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [currentUser, setCurrentUser] = useState<AppUser>(EMPTY_USER);
  const [selectedLocationId, setSelectedLocationId] = useState<string | 'ALL'>('ALL');

  // ── Load all data once authenticated ──────────────────────────────────────

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [locsData, itemsData, kitsData, movsData, usersData] = await Promise.all([
        api.locations.list(),
        api.items.list(),
        api.kits.list(),
        api.movements.list(),
        api.users.list(),
      ]);
      setLocations(locsData);
      setItems(itemsData);
      setKits(kitsData.map((k: any) => ({ ...k, components: k.components || [] })));
      setMovements(movsData);
      setUsers(usersData);
    } catch (e) {
      console.error('Failed to load data:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check if already logged in on mount
  useEffect(() => {
    api.auth.me()
      .then((user: AppUser) => {
        setCurrentUser(user);
        setIsAuthenticated(true);
        if (!user.locationIds.includes('ALL') && user.locationIds.length > 0) {
          setSelectedLocationId(user.locationIds[0]);
        }
      })
      .catch(() => setIsAuthenticated(false))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (isAuthenticated) loadAll();
  }, [isAuthenticated, loadAll]);

  // ── Auth ──────────────────────────────────────────────────────────────────

  const login = async (email: string, password: string) => {
    const res = await api.auth.login(email, password);
    setCurrentUser(res.user);
    setIsAuthenticated(true);
    if (!res.user.locationIds.includes('ALL') && res.user.locationIds.length > 0) {
      setSelectedLocationId(res.user.locationIds[0]);
    }
  };

  const logout = async () => {
    await api.auth.logout();
    setIsAuthenticated(false);
    setCurrentUser(EMPTY_USER);
    setLocations([]); setItems([]); setKits([]); setMovements([]); setUsers([]);
  };

  // ── Roles ─────────────────────────────────────────────────────────────────

  const isCurrentUserAdmin = currentUser.role === 'ADMIN';
  const isCurrentUserController = currentUser.role === 'CONTROLLER';
  const isCurrentUserViewer = currentUser.role === 'VIEWER';

  const userAccessibleLocations = useMemo(() => {
    if (isCurrentUserAdmin || currentUser.locationIds.includes('ALL')) return locations;
    return locations.filter(l => currentUser.locationIds.includes(l.id));
  }, [locations, isCurrentUserAdmin, currentUser.locationIds]);

  const canEditStock = useCallback((targetLocationId?: string): boolean => {
    if (isCurrentUserViewer) return false;
    if (isCurrentUserAdmin) return true;
    if (currentUser.locationIds.includes('ALL')) return true;
    if (!targetLocationId) return true;
    return currentUser.locationIds.includes(targetLocationId);
  }, [currentUser, isCurrentUserAdmin, isCurrentUserViewer]);

  const canManageUsers = isCurrentUserAdmin;
  const canManageLocations = isCurrentUserAdmin;
  const currentUserId = currentUser.id;

  const setCurrentUserId = (id: string) => {
    const u = users.find(u => u.id === id);
    if (u) setCurrentUser(u);
  };

  // ── Users CRUD ────────────────────────────────────────────────────────────

  const addUser = async (userData: Omit<AppUser, 'id' | 'createdAt'>): Promise<AppUser> => {
    const user = await api.users.create(userData);
    setUsers(prev => [...prev, user]);
    return user;
  };

  const updateUser = async (id: string, userData: Partial<AppUser>) => {
    const user = await api.users.update(id, userData);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...user } : u));
    if (id === currentUser.id) setCurrentUser(prev => ({ ...prev, ...user }));
  };

  const deleteUser = async (id: string): Promise<{ success: boolean; message?: string }> => {
    try {
      await api.users.delete(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      return { success: true };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  };

  // ── Locations CRUD ────────────────────────────────────────────────────────

  const addLocation = async (data: Omit<Location, 'id' | 'createdAt'>): Promise<Location> => {
    const loc = await api.locations.create(data);
    setLocations(prev => [...prev, loc]);
    return loc;
  };

  const updateLocation = async (id: string, data: Partial<Location>) => {
    const loc = await api.locations.update(id, data);
    setLocations(prev => prev.map(l => l.id === id ? { ...l, ...loc } : l));
  };

  const deleteLocation = async (id: string): Promise<{ success: boolean; message?: string }> => {
    try {
      await api.locations.delete(id);
      setLocations(prev => prev.filter(l => l.id !== id));
      return { success: true };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  };

  // ── Items CRUD ────────────────────────────────────────────────────────────

  const addItem = async (data: Omit<EpiItem, 'id' | 'updatedAt'>): Promise<EpiItem> => {
    const item = await api.items.create(data);
    await loadAll();
    return item;
  };

  const updateItem = async (id: string, data: Partial<EpiItem>) => {
    await api.items.update(id, data);
    await loadAll();
  };

  const deleteItem = async (id: string) => {
    await api.items.delete(id);
    await loadAll();
  };

  // ── Movements ─────────────────────────────────────────────────────────────

  const registerSingleMovement = async (params: {
    itemId: string; type: MovementType; quantity: number; reason: string;
    employeeName?: string; employeeRole?: string; employeeRegistration?: string; notes?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const endpoint = params.type === 'ENTRADA' ? api.movements.entry : api.movements.exit;
      const res = await endpoint({ ...params });
      setItems(prev => prev.map(i => i.id === res.item.id ? { ...i, ...res.item } : i));
      setMovements(prev => [res.movement, ...prev]);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };

  const registerBatchMovement = async (params: {
    locationId: string; entries: BatchMovementEntry[]; reason: string;
    employeeName?: string; employeeRole?: string; employeeRegistration?: string;
    isDailyClosing?: boolean; notes?: string;
  }): Promise<{ success: boolean; count: number; error?: string }> => {
    try {
      const res = await api.movements.batch(params);
      // Refresh items from server to keep in sync
      const updatedItems = await api.items.list();
      setItems(updatedItems);
      const updatedMovs = await api.movements.list();
      setMovements(updatedMovs);
      return { success: true, count: res.count };
    } catch (e: any) {
      return { success: false, count: 0, error: e.message };
    }
  };

  const transferStock = async (params: {
    sourceItemId: string; targetLocationId: string; quantity: number; reason: string; notes?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      await api.movements.transfer(params);
      const [updatedItems, updatedMovs] = await Promise.all([api.items.list(), api.movements.list()]);
      setItems(updatedItems);
      setMovements(updatedMovs);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };

  // ── Kits CRUD ─────────────────────────────────────────────────────────────

  const addKit = async (data: Omit<EpiKit, 'id' | 'createdAt' | 'updatedAt'>): Promise<EpiKit> => {
    const kit = await api.kits.create(data);
    setKits(prev => [...prev, kit]);
    return kit;
  };

  const updateKit = async (id: string, data: Partial<EpiKit>) => {
    const kit = await api.kits.update(id, data);
    setKits(prev => prev.map(k => k.id === id ? kit : k));
  };

  const deleteKit = async (id: string) => {
    await api.kits.delete(id);
    setKits(prev => prev.filter(k => k.id !== id));
  };

  const deliverKit = async (params: {
    kitId: string; locationId: string; quantityOfKits: number;
    employeeName?: string; employeeRole?: string; employeeRegistration?: string; notes?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      await api.movements.deliverKit(params);
      const [updatedItems, updatedMovs] = await Promise.all([api.items.list(), api.movements.list()]);
      setItems(updatedItems);
      setMovements(updatedMovs);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };

  // ── Kit Availability (computed locally) ───────────────────────────────────

  const findItemForComponent = (itemId: string, itemName: string, locationId: string): EpiItem | undefined => {
    const direct = items.find(i => i.id === itemId && i.locationId === locationId);
    if (direct) return direct;
    return items.find(i => i.locationId === locationId && i.name.toLowerCase() === itemName.toLowerCase());
  };

  const getKitAvailabilityForLocation = (kitId: string, locationId: string): KitAvailability | null => {
    const kit = kits.find(k => k.id === kitId);
    const loc = locations.find(l => l.id === locationId);
    if (!kit || !loc) return null;

    const limitingItems: KitLimitingItem[] = [];
    let maxCompleteKits = Infinity;

    for (const comp of kit.components) {
      const item = findItemForComponent(comp.itemId, comp.itemName, locationId);
      const available = item?.quantity || 0;
      const canMake = comp.quantity > 0 ? Math.floor(available / comp.quantity) : Infinity;
      if (canMake < maxCompleteKits) maxCompleteKits = canMake;
      if (!item || available < comp.quantity) {
        limitingItems.push({ itemId: comp.itemId, itemName: comp.itemName, available, required: comp.quantity });
      }
    }

    if (maxCompleteKits === Infinity) maxCompleteKits = 0;

    return {
      kitId, kitName: kit.name, locationId, locationName: loc.name,
      maxCompleteKits, limitingItems,
      canAssemble: limitingItems.length === 0 && maxCompleteKits > 0,
    };
  };

  const getAllKitsAvailability = (locationId?: string): KitAvailability[] => {
    const targetLocs = locationId && locationId !== 'ALL'
      ? locations.filter(l => l.id === locationId)
      : locations;
    return kits.flatMap(kit =>
      targetLocs.map(loc => getKitAvailabilityForLocation(kit.id, loc.id)).filter(Boolean) as KitAvailability[]
    );
  };

  // ── Legacy stubs (no-op for backup/restore — data is in DB now) ───────────

  const resetToDefaultData = () => { loadAll(); };
  const exportBackupJSON = () => JSON.stringify({ locations, items, kits, movements, users }, null, 2);
  const importBackupJSON = (_json: string) => false;

  // ── Compute Homologated Items Display per Location ────────────────────────
  const displayItems = useMemo(() => {
    if (items.length === 0) return [];

    // Group items by name (case-insensitive) to form the Homologated Catalog
    const catalogMap = new Map<string, EpiItem>();
    for (const item of items) {
      const key = (item.name || '').trim().toLowerCase();
      if (!catalogMap.has(key)) {
        catalogMap.set(key, item);
      }
    }

    // Case 1: ALL locations selected
    if (selectedLocationId === 'ALL') {
      return Array.from(catalogMap.values()).map(template => {
        const key = (template.name || '').trim().toLowerCase();
        const matching = items.filter(i => (i.name || '').trim().toLowerCase() === key);
        const totalQty = matching.reduce((sum, i) => sum + i.quantity, 0);
        return {
          ...template,
          quantity: totalQty,
          locationId: 'ALL',
        };
      });
    }

    // Case 2: Specific location selected
    return Array.from(catalogMap.values()).map(template => {
      const key = (template.name || '').trim().toLowerCase();
      const matchInLocation = items.find(
        i => (i.name || '').trim().toLowerCase() === key && i.locationId === selectedLocationId
      );

      if (matchInLocation) {
        return matchInLocation;
      }

      // Virtual item representation for this location with 0 stock
      return {
        ...template,
        id: `virtual-${template.id}-${selectedLocationId}`,
        locationId: selectedLocationId,
        quantity: 0,
      };
    });
  }, [items, selectedLocationId]);

  // ── Context Value ─────────────────────────────────────────────────────────

  const value: StockContextType = {
    locations, items: displayItems, kits, movements, users, isLoading,
    currentUserId, currentUser, selectedLocationId, setSelectedLocationId,
    isAuthenticated, login, logout,
    addUser, updateUser, deleteUser, setCurrentUserId,
    isCurrentUserAdmin, isCurrentUserController, isCurrentUserViewer,
    canEditStock, canManageUsers, canManageLocations, userAccessibleLocations,
    addLocation, updateLocation, deleteLocation,
    addItem, updateItem, deleteItem,
    registerSingleMovement, registerBatchMovement, transferStock,
    addKit, updateKit, deleteKit, deliverKit,
    getKitAvailabilityForLocation, getAllKitsAvailability,
    resetToDefaultData, exportBackupJSON, importBackupJSON,
  };

  return <StockContext.Provider value={value}>{children}</StockContext.Provider>;
};

export const useStock = () => {
  const ctx = useContext(StockContext);
  if (!ctx) throw new Error('useStock must be used within StockProvider');
  return ctx;
};
