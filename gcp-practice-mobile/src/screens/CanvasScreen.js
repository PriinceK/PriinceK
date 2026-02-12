import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert, Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { GCP_SERVICES, GCP_SERVICE_CATEGORIES } from '../data/gcpServices';

export default function CanvasScreen() {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [connectMode, setConnectMode] = useState(false);
  const [connectFrom, setConnectFrom] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [projectName, setProjectName] = useState('Untitled Architecture');
  const [showServicePicker, setShowServicePicker] = useState(false);

  const filteredServices = GCP_SERVICES.filter((s) => {
    const matchesSearch = !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !activeCategory || s.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  function addNode(service) {
    if (nodes.find((n) => n.service.id === service.id)) return;
    setNodes((prev) => [...prev, { id: `node-${Date.now()}`, service }]);
    setShowServicePicker(false);
  }

  function removeNode(nodeId) {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setConnections((prev) => prev.filter((c) => c.from !== nodeId && c.to !== nodeId));
    if (connectFrom === nodeId) setConnectFrom(null);
  }

  function handleNodeTap(nodeId) {
    if (!connectMode) return;
    if (!connectFrom) {
      setConnectFrom(nodeId);
    } else if (connectFrom !== nodeId) {
      const exists = connections.some(
        (c) => (c.from === connectFrom && c.to === nodeId) || (c.from === nodeId && c.to === connectFrom)
      );
      if (!exists) {
        const fromNode = nodes.find((n) => n.id === connectFrom);
        const toNode = nodes.find((n) => n.id === nodeId);
        setConnections((prev) => [...prev, {
          id: `conn-${Date.now()}`,
          from: connectFrom,
          to: nodeId,
          fromName: fromNode?.service.name,
          toName: toNode?.service.name,
        }]);
      }
      setConnectFrom(null);
    }
  }

  function removeConnection(connId) {
    setConnections((prev) => prev.filter((c) => c.id !== connId));
  }

  function clearCanvas() {
    Alert.alert('Clear Canvas', 'Remove all services and connections?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear', style: 'destructive', onPress: () => {
          setNodes([]);
          setConnections([]);
          setConnectFrom(null);
        }
      },
    ]);
  }

  async function exportDesign() {
    const design = {
      name: projectName,
      exportedAt: new Date().toISOString(),
      services: nodes.map((n) => ({
        name: n.service.name,
        id: n.service.id,
        category: n.service.category,
      })),
      connections: connections.map((c) => ({
        from: c.fromName,
        to: c.toName,
      })),
    };

    try {
      await Share.share({
        message: JSON.stringify(design, null, 2),
        title: projectName,
      });
    } catch (e) {
      // user cancelled
    }
  }

  return (
    <View style={styles.container}>
      {/* Toolbar */}
      <View style={styles.toolbar}>
        <TextInput
          style={styles.projectNameInput}
          value={projectName}
          onChangeText={setProjectName}
          placeholder="Project name"
          placeholderTextColor={colors.muted}
        />
        <View style={styles.toolbarButtons}>
          <TouchableOpacity
            style={[styles.toolBtn, connectMode && styles.toolBtnActive]}
            onPress={() => { setConnectMode(!connectMode); setConnectFrom(null); }}
          >
            <Ionicons name={connectMode ? 'link' : 'git-network-outline'} size={16} color={connectMode ? colors.blue : colors.muted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolBtn} onPress={exportDesign} disabled={nodes.length === 0}>
            <Ionicons name="share-outline" size={16} color={nodes.length > 0 ? colors.muted : colors.border} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolBtn} onPress={clearCanvas} disabled={nodes.length === 0}>
            <Ionicons name="trash-outline" size={16} color={nodes.length > 0 ? colors.red : colors.border} />
          </TouchableOpacity>
        </View>
      </View>

      {connectMode && (
        <View style={styles.connectBanner}>
          <Ionicons name="link" size={14} color={colors.blue} />
          <Text style={styles.connectBannerText}>
            {connectFrom
              ? `Tap another service to connect from "${nodes.find(n => n.id === connectFrom)?.service.name}"`
              : 'Tap a service to start a connection'}
          </Text>
        </View>
      )}

      <ScrollView style={styles.canvas} contentContainerStyle={styles.canvasContent}>
        {/* Architecture nodes */}
        {nodes.length === 0 && !showServicePicker ? (
          <View style={styles.emptyState}>
            <Ionicons name="grid-outline" size={48} color={colors.border} />
            <Text style={styles.emptyTitle}>Blank Canvas</Text>
            <Text style={styles.emptySubtitle}>
              Tap the + button below to add GCP services and start designing your architecture.
            </Text>
          </View>
        ) : (
          <>
            {/* Nodes */}
            {nodes.map((node) => {
              const cat = GCP_SERVICE_CATEGORIES[node.service.category];
              const isConnectSource = connectFrom === node.id;
              return (
                <TouchableOpacity
                  key={node.id}
                  style={[
                    styles.nodeCard,
                    { borderColor: isConnectSource ? colors.blue : (cat?.color || colors.border) + '50' },
                    isConnectSource && { backgroundColor: colors.blue + '10' },
                  ]}
                  activeOpacity={connectMode ? 0.6 : 0.8}
                  onPress={() => handleNodeTap(node.id)}
                  onLongPress={() => {
                    if (!connectMode) {
                      Alert.alert('Remove Service', `Remove ${node.service.name}?`, [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Remove', style: 'destructive', onPress: () => removeNode(node.id) },
                      ]);
                    }
                  }}
                >
                  <View style={[styles.nodeIcon, { backgroundColor: (cat?.color || colors.blue) + '20' }]}>
                    <Text style={[styles.nodeIconText, { color: cat?.color || colors.blue }]}>
                      {node.service.name.slice(0, 2).toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.nodeName}>{node.service.name}</Text>
                    <Text style={styles.nodeCategory}>{cat?.label}</Text>
                  </View>
                  {!connectMode && (
                    <TouchableOpacity onPress={() => removeNode(node.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                      <Ionicons name="close-circle" size={18} color={colors.muted} />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              );
            })}

            {/* Connections */}
            {connections.length > 0 && (
              <View style={styles.connectionsSection}>
                <Text style={styles.connectionsSectionTitle}>Connections</Text>
                {connections.map((conn) => (
                  <View key={conn.id} style={styles.connectionItem}>
                    <Ionicons name="git-network" size={14} color={colors.blue} />
                    <Text style={styles.connectionText}>
                      {conn.fromName} <Text style={{ color: colors.muted }}> → </Text> {conn.toName}
                    </Text>
                    <TouchableOpacity onPress={() => removeConnection(conn.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                      <Ionicons name="close" size={14} color={colors.muted} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </>
        )}

        {/* Service picker inline */}
        {showServicePicker && (
          <View style={styles.pickerSection}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Add GCP Services</Text>
              <TouchableOpacity onPress={() => setShowServicePicker(false)}>
                <Ionicons name="close" size={20} color={colors.muted} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Search services..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
              <TouchableOpacity
                style={[styles.catBtn, !activeCategory && styles.catBtnActive]}
                onPress={() => setActiveCategory(null)}
              >
                <Text style={[styles.catBtnText, !activeCategory && { color: colors.blue }]}>All</Text>
              </TouchableOpacity>
              {Object.entries(GCP_SERVICE_CATEGORIES).map(([key, cat]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.catBtn,
                    activeCategory === key && { backgroundColor: cat.color + '20', borderColor: cat.color + '40' },
                  ]}
                  onPress={() => setActiveCategory(activeCategory === key ? null : key)}
                >
                  <Text style={[styles.catBtnText, activeCategory === key && { color: cat.color }]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {filteredServices.map((service) => {
              const isAdded = nodes.some((n) => n.service.id === service.id);
              const cat = GCP_SERVICE_CATEGORIES[service.category];
              return (
                <TouchableOpacity
                  key={service.id}
                  style={[styles.pickerItem, isAdded && styles.pickerItemAdded]}
                  onPress={() => addNode(service)}
                  disabled={isAdded}
                  activeOpacity={0.7}
                >
                  <View style={[styles.catIndicator, { backgroundColor: cat?.color }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.pickerItemName, isAdded && { color: colors.muted }]}>
                      {service.name}
                    </Text>
                    <Text style={styles.pickerItemDesc} numberOfLines={1}>{service.description}</Text>
                  </View>
                  {isAdded ? (
                    <Ionicons name="checkmark-circle" size={18} color={colors.green} />
                  ) : (
                    <Ionicons name="add-circle-outline" size={18} color={colors.blue} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB to add services */}
      {!showServicePicker && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowServicePicker(true)}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Status bar */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>{nodes.length} services</Text>
        <Text style={styles.statusText}>{connections.length} connections</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  toolbar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1,
    borderBottomColor: colors.border, backgroundColor: colors.darker,
  },
  projectNameInput: {
    fontSize: 15, fontWeight: '600', color: colors.text, flex: 1, marginRight: 10,
  },
  toolbarButtons: { flexDirection: 'row', gap: 6 },
  toolBtn: {
    width: 36, height: 36, borderRadius: 10, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  toolBtnActive: { backgroundColor: colors.blue + '20', borderColor: colors.blue + '40' },

  connectBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.blue + '15', paddingHorizontal: 16, paddingVertical: 8,
  },
  connectBannerText: { fontSize: 12, color: colors.blue, flex: 1 },

  canvas: { flex: 1 },
  canvasContent: { padding: 16 },

  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: colors.muted, marginTop: 12 },
  emptySubtitle: { fontSize: 13, color: colors.muted, textAlign: 'center', marginTop: 6, paddingHorizontal: 40, lineHeight: 19 },

  nodeCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.card, borderRadius: 14, padding: 14,
    marginBottom: 8, borderWidth: 1.5,
  },
  nodeIcon: {
    width: 40, height: 40, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  nodeIconText: { fontSize: 13, fontWeight: '800' },
  nodeName: { fontSize: 14, fontWeight: '600', color: colors.text },
  nodeCategory: { fontSize: 11, color: colors.muted, marginTop: 1 },

  connectionsSection: { marginTop: 16, marginBottom: 8 },
  connectionsSectionTitle: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 8 },
  connectionItem: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.darker, borderRadius: 10, padding: 10, marginBottom: 4,
  },
  connectionText: { fontSize: 12, color: colors.text, flex: 1 },

  pickerSection: { marginTop: 16 },
  pickerHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12,
  },
  pickerTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  searchInput: {
    backgroundColor: colors.darker, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 13, color: colors.text, borderWidth: 1, borderColor: colors.border, marginBottom: 10,
  },
  catScroll: { marginBottom: 12 },
  catBtn: {
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8,
    borderWidth: 1, borderColor: colors.border, marginRight: 6,
  },
  catBtnActive: { backgroundColor: colors.blue + '20', borderColor: colors.blue + '40' },
  catBtnText: { fontSize: 11, color: colors.muted, fontWeight: '500' },

  pickerItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.card, borderRadius: 10, padding: 12, marginBottom: 6,
    borderWidth: 1, borderColor: colors.border,
  },
  pickerItemAdded: { opacity: 0.5 },
  catIndicator: { width: 4, height: 28, borderRadius: 2 },
  pickerItemName: { fontSize: 13, fontWeight: '600', color: colors.text },
  pickerItemDesc: { fontSize: 11, color: colors.muted, marginTop: 1 },

  fab: {
    position: 'absolute', bottom: 50, right: 20,
    width: 56, height: 56, borderRadius: 28, backgroundColor: colors.blue,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.blue, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 8,
  },

  statusBar: {
    flexDirection: 'row', gap: 16,
    paddingHorizontal: 16, paddingVertical: 8,
    borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.darker,
  },
  statusText: { fontSize: 11, color: colors.muted },
});
