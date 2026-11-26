import { Button, Card, Popconfirm, Space, Table, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

export default function ProductsView({ activeMenu, renderSearch, openModal, filteredProducts, deleteProduct, adminTableScroll, formatCurrency }) {
  return (
    <>
          {activeMenu === "products" && (
            <Card className="admin-card-table">
              {renderSearch("products", "Tìm theo tên, danh mục, size...")}
              <Table
                dataSource={filteredProducts}
                rowKey="id"
                scroll={adminTableScroll}
                pagination={{ pageSize: 10 }}
                columns={[
                  {
                    title: "Ảnh",
                    dataIndex: "imageUrl",
                    width: 80,
                    render: (src, record) => (
                      <img
                        src={src || "/media/placeholder.svg"}
                        alt={record.name}
                        style={{
                          width: 60,
                          height: 48,
                          objectFit: "cover",
                          borderRadius: 6,
                        }}
                      />
                    ),
                  },
                  {
                    title: "Sản phẩm",
                    dataIndex: "name",
                    render: (name, record) => (
                      <div>
                        <strong>{name}</strong>
                        <div style={{ fontSize: 11, color: "#8a968e" }}>
                          /{record.slug}
                        </div>
                      </div>
                    ),
                  },
                  { title: "Danh mục", dataIndex: "category" },
                  {
                    title: "Giá",
                    dataIndex: "price",
                    render: formatCurrency,
                  },
                  {
                    title: "Kích cỡ",
                    dataIndex: "sizes",
                    render: (sizes) => sizes || "Không phân size",
                  },
                  {
                    title: "Tình trạng",
                    dataIndex: "inStock",
                    render: (inStock) => (
                      <Tag color={inStock ? "green" : "default"}>
                        {inStock ? "Còn hàng" : "Tạm hết"}
                      </Tag>
                    ),
                  },
                  {
                    title: "Thao tác",
                    fixed: "right",
                    width: 110,
                    render: (_, record) => (
                      <Space>
                        <Button
                          type="text"
                          icon={<EditOutlined style={{ color: "#880099" }} />}
                          onClick={() => openModal("product", record)}
                        />
                        <Popconfirm
                          title="Xóa sản phẩm này?"
                          description="Sản phẩm sẽ bị gỡ khỏi danh mục trên website."
                          onConfirm={() => deleteProduct(record.id)}
                          okText="Xóa"
                          cancelText="Hủy"
                        >
                          <Button danger type="text" icon={<DeleteOutlined />} />
                        </Popconfirm>
                      </Space>
                    ),
                  },
                ]}
              />
            </Card>
          )}
    </>
  );
}
