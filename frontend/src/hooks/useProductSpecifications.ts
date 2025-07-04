import { useState, useCallback } from 'react';
import { ProductSpecification } from '../types';

export const useProductSpecifications = (initialSpecs: ProductSpecification[] = []) => {
  const [specifications, setSpecifications] = useState<ProductSpecification[]>(initialSpecs);

  const addSpecification = useCallback(() => {
    const newSpec: ProductSpecification = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      value: '',
      type: 'text',
      group: '',
      displayOrder: specifications.length,
      required: false
    };
    setSpecifications(prev => [...prev, newSpec]);
  }, [specifications.length]);

  const removeSpecification = useCallback((index: number) => {
    setSpecifications(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateSpecification = useCallback((index: number, field: string, value: any) => {
    setSpecifications(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  const getSpecificationsByGroup = useCallback(() => {
    const grouped = specifications.reduce((acc, spec) => {
      const group = spec.group || 'Khác';
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(spec);
      return acc;
    }, {} as Record<string, ProductSpecification[]>);

    // Sort specifications within each group by displayOrder
    Object.keys(grouped).forEach(group => {
      grouped[group].sort((a, b) => a.displayOrder - b.displayOrder);
    });

    return grouped;
  }, [specifications]);

  const validateSpecifications = useCallback(() => {
    const errors: string[] = [];
    
    specifications.forEach((spec, index) => {
      if (spec.required && !spec.value) {
        errors.push(`Thuộc tính "${spec.name || `#${index + 1}`}" là bắt buộc`);
      }
      if (!spec.name) {
        errors.push(`Tên thuộc tính #${index + 1} không được để trống`);
      }
      if (spec.type === 'select' && (!spec.options || spec.options.length === 0)) {
        errors.push(`Thuộc tính "${spec.name}" cần có ít nhất một lựa chọn`);
      }
    });

    return errors;
  }, [specifications]);

  const resetSpecifications = useCallback(() => {
    setSpecifications(initialSpecs);
  }, [initialSpecs]);

  return {
    specifications,
    setSpecifications,
    addSpecification,
    removeSpecification,
    updateSpecification,
    getSpecificationsByGroup,
    validateSpecifications,
    resetSpecifications
  };
};