
import { BaseHybridService } from './baseService';
import { InventoryReceipt, InventoryReceiptItem, AdditionalCost } from '../types';

export class InventoryReceiptService extends BaseHybridService {
  private receipts: InventoryReceipt[] = [];
  private nextId = 1;

  async getReceipts(): Promise<InventoryReceipt[]> {
    return this.receipts;
  }

  async getReceiptById(id: string): Promise<InventoryReceipt | null> {
    return this.receipts.find(receipt => receipt.id === id) || null;
  }

  async createReceipt(receipt: Omit<InventoryReceipt, 'id' | 'created_at' | 'updated_at'>): Promise<InventoryReceipt> {
    const newReceipt: InventoryReceipt = {
      ...receipt,
      id: this.nextId.toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    this.receipts.push(newReceipt);
    this.nextId++;
    return newReceipt;
  }

  async updateReceipt(id: string, updates: Partial<InventoryReceipt>): Promise<InventoryReceipt> {
    const index = this.receipts.findIndex(receipt => receipt.id === id);
    if (index === -1) {
      throw new Error('Không tìm thấy phiếu nhập kho');
    }

    this.receipts[index] = {
      ...this.receipts[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    return this.receipts[index];
  }

  async deleteReceipt(id: string): Promise<void> {
    const index = this.receipts.findIndex(receipt => receipt.id === id);
    if (index === -1) {
      throw new Error('Không tìm thấy phiếu nhập kho');
    }
    this.receipts.splice(index, 1);
  }

  async addReceiptItem(receiptId: string, item: Omit<InventoryReceiptItem, 'id' | 'receipt_id'>): Promise<InventoryReceiptItem> {
    const receipt = await this.getReceiptById(receiptId);
    if (!receipt) {
      throw new Error('Không tìm thấy phiếu nhập kho');
    }

    const newItem: InventoryReceiptItem = {
      ...item,
      id: `${receiptId}-${receipt.items.length + 1}`,
      receipt_id: receiptId,
    };

    receipt.items.push(newItem);
    await this.updateReceipt(receiptId, { 
      items: receipt.items,
      total_amount: this.calculateTotalAmount(receipt)
    });

    return newItem;
  }

  async updateReceiptItem(receiptId: string, itemId: string, updates: Partial<InventoryReceiptItem>): Promise<InventoryReceiptItem> {
    const receipt = await this.getReceiptById(receiptId);
    if (!receipt) {
      throw new Error('Không tìm thấy phiếu nhập kho');
    }

    const itemIndex = receipt.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error('Không tìm thấy sản phẩm');
    }

    receipt.items[itemIndex] = {
      ...receipt.items[itemIndex],
      ...updates,
      total_price: (updates.quantity || receipt.items[itemIndex].quantity) * 
                  (updates.unit_price || receipt.items[itemIndex].unit_price)
    };

    await this.updateReceipt(receiptId, { 
      items: receipt.items,
      total_amount: this.calculateTotalAmount(receipt)
    });

    return receipt.items[itemIndex];
  }

  async removeReceiptItem(receiptId: string, itemId: string): Promise<void> {
    const receipt = await this.getReceiptById(receiptId);
    if (!receipt) {
      throw new Error('Không tìm thấy phiếu nhập kho');
    }

    receipt.items = receipt.items.filter(item => item.id !== itemId);
    await this.updateReceipt(receiptId, { 
      items: receipt.items,
      total_amount: this.calculateTotalAmount(receipt)
    });
  }

  private calculateTotalAmount(receipt: InventoryReceipt): number {
    const itemsTotal = receipt.items.reduce((sum, item) => sum + item.total_price, 0);
    const costsTotal = receipt.additional_costs.reduce((sum, cost) => {
      // Convert to base currency if needed (simplified)
      return sum + cost.amount;
    }, 0);
    return itemsTotal + costsTotal;
  }
}

export const inventoryReceiptService = new InventoryReceiptService();
