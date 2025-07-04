import { useState, useEffect } from 'react';
import { InventoryItem } from '../types';
import { serviceFactory } from '../services/serviceFactory';

export const useInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const service = serviceFactory.getService('inventory');
      const data = await service.getAll();
      setInventory(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch inventory');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const transferStock = async (
    itemId: string, 
    fromStatus: 'sellable' | 'damaged' | 'hold' | 'transit',
    toStatus: 'sellable' | 'damaged' | 'hold' | 'transit',
    quantity: number,
    reason?: string
  ) => {
    try {
      const service = serviceFactory.getService('inventory');
      const updatedItem = await service.transferStock(itemId, fromStatus, toStatus, quantity, reason);

      setInventory(prev => 
        prev.map(item => 
          item.id === itemId ? updatedItem : item
        )
      );
      setError(null);
      
      // Refresh inventory to ensure data consistency
      await fetchInventory();
    } catch (err) {
      setError('Failed to transfer stock');
      console.error(err);
      throw err;
    }
  };

  const addNewStock = async (
    itemId: string,
    status: 'sellable' | 'damaged' | 'hold' | 'transit',
    quantity: number,
    reason?: string
  ) => {
    try {
      setLoading(true);
      const service = serviceFactory.getService('inventory');
      const updatedItem = await service.addNewStock(itemId, status, quantity, reason);

      setInventory(prev => 
        prev.map(item => 
          item.id === itemId ? updatedItem : item
        )
      );
      setError(null);
    } catch (err) {
      setError('Failed to add new stock');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const transferBetweenVariants = async (
    fromVariantId: string,
    toVariantId: string,
    quantity: number,
    reason?: string
  ) => {
    try {
      const service = serviceFactory.getService('inventory');
      const result = await service.transferBetweenVariants(fromVariantId, toVariantId, quantity, reason);

      setInventory(prev => 
        prev.map(item => {
          if (item.id === fromVariantId) {
            return result.fromVariant;
          } else if (item.id === toVariantId) {
            return result.toVariant;
          }
          return item;
        })
      );
      setError(null);
      
      // Refresh inventory to ensure data consistency
      await fetchInventory();
    } catch (err) {
      setError('Failed to transfer between variants');
      console.error(err);
      throw err;
    }
  };

  const getLowStockItems = () => {
    return inventory.filter(item => item.availableStock <= item.reorderLevel);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return {
    inventory,
    loading,
    error,
    fetchInventory,
    transferStock,
    addNewStock,
    transferBetweenVariants,
    getLowStockItems,
  };
};