import { useEffect, useState } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api' });
const defaults = ['Electronics', 'Furniture', 'Clothing'];
const blank = { name: '', itemType: defaults[0], purchaseDate: '', stockAvailable: false };

const Products = () => {
  const [rows, setRows] = useState([{ ...blank }]);
  const [items, setItems] = useState([]);
  const [types, setTypes] = useState(defaults);
  const [editingId, setEditingId] = useState(null);
  const [edit, setEdit] = useState({ ...blank });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [typesRes, itemsRes] = await Promise.all([api.get('/item-types'), api.get('/items')]);
      const dbTypes = (typesRes.data.itemTypes || []).map((t) => t.typeName);
      setTypes([...new Set([...defaults, ...dbTypes])]);
      setItems(itemsRes.data.items || []);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load data');
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, []);

  const changeRow = (i, key, value) => setRows((v) => v.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)));
  const addRow = () => setRows((v) => [...v, { ...blank }]);
  const removeRow = (i) => rows.length > 1 && setRows((v) => v.filter((_, idx) => idx !== i));

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const payload = rows.length === 1 ? rows[0] : { items: rows };
      const res = await api.post('/items', payload);
      setMessage(res.data.message);
      setRows([{ ...blank }]);
      await load();
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      setError(apiErrors ? apiErrors.join(' ') : err.response?.data?.message || 'Create failed');
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEdit({
      name: item.name,
      itemType: item.itemType,
      purchaseDate: item.purchaseDate?.slice(0, 10) || '',
      stockAvailable: item.stockAvailable,
    });
  };

  const saveEdit = async () => {
    try {
      setError('');
      const res = await api.put(`/items/${editingId}`, edit);
      setMessage(res.data.message);
      setEditingId(null);
      await load();
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      setError(apiErrors ? apiErrors.join(' ') : err.response?.data?.message || 'Update failed');
    }
  };

  const remove = async (id) => {
    try {
      setError('');
      const res = await api.delete(`/items/${id}`);
      setMessage(res.data.message);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mx-auto max-w-5xl space-y-4">
        <h1 className="text-2xl font-semibold">Inventory Manager</h1>
        <form className="space-y-3 rounded bg-white p-4 shadow" onSubmit={submit}>
          {rows.map((r, i) => (
            <div key={i} className="grid gap-2 md:grid-cols-5">
              <input
                className="rounded border p-2"
                placeholder="Item Name"
                value={r.name}
                onChange={(e) => changeRow(i, 'name', e.target.value)}
                required
              />
              <select
                className="rounded border p-2"
                value={r.itemType}
                onChange={(e) => changeRow(i, 'itemType', e.target.value)}
                required
              >
                {types.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <input
                className="rounded border p-2"
                type="date"
                value={r.purchaseDate}
                onChange={(e) => changeRow(i, 'purchaseDate', e.target.value)}
                required
              />
              <label className="flex items-center gap-2 rounded border p-2">
                <input
                  type="checkbox"
                  checked={r.stockAvailable}
                  onChange={(e) => changeRow(i, 'stockAvailable', e.target.checked)}
                />
                In Stock
              </label>
              <button
                type="button"
                className="rounded border border-red-300 bg-red-50 px-3 py-2"
                onClick={() => removeRow(i)}
              >
                Remove
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <button type="button" className="rounded bg-slate-200 px-3 py-2" onClick={addRow}>Add Item</button>
            <button type="submit" className="rounded bg-blue-600 px-3 py-2 text-white">Submit Purchase</button>
          </div>
          {message && <p className="text-sm text-green-700">{message}</p>}
          {error && <p className="text-sm text-red-700">{error}</p>}
        </form>

        <div className="overflow-x-auto rounded bg-white p-4 shadow">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2">Name</th>
                <th className="p-2">Type</th>
                <th className="p-2">Purchase Date</th>
                <th className="p-2">Stock</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-2">
                    {editingId === item.id ? (
                      <input className="w-full rounded border p-1" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
                    ) : item.name}
                  </td>
                  <td className="p-2">
                    {editingId === item.id ? (
                      <select className="w-full rounded border p-1" value={edit.itemType} onChange={(e) => setEdit({ ...edit, itemType: e.target.value })}>
                        {types.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    ) : item.itemType}
                  </td>
                  <td className="p-2">
                    {editingId === item.id ? (
                      <input className="w-full rounded border p-1" type="date" value={edit.purchaseDate} onChange={(e) => setEdit({ ...edit, purchaseDate: e.target.value })} />
                    ) : item.purchaseDate?.slice(0, 10)}
                  </td>
                  <td className="p-2">
                    {editingId === item.id ? (
                      <input type="checkbox" checked={edit.stockAvailable} onChange={(e) => setEdit({ ...edit, stockAvailable: e.target.checked })} />
                    ) : item.stockAvailable ? 'Yes' : 'No'}
                  </td>
                  <td className="p-2">
                    {editingId === item.id ? (
                      <div className="flex gap-2">
                        <button className="rounded bg-blue-600 px-2 py-1 text-white" onClick={saveEdit}>Save</button>
                        <button className="rounded bg-slate-300 px-2 py-1" onClick={() => setEditingId(null)}>Cancel</button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button className="rounded bg-amber-500 px-2 py-1 text-white" onClick={() => startEdit(item)}>Update</button>
                        <button className="rounded bg-red-600 px-2 py-1 text-white" onClick={() => remove(item.id)}>Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td className="p-2 text-slate-500" colSpan={5}>No items yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;
