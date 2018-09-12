package com.praksa.breza.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A DeliveryOrderItem.
 */
@Entity
@Table(name = "delivery_order_item")
public class DeliveryOrderItem implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Min(value = 1L)
    @Column(name = "prepared_amount")
    private Long preparedAmount;

    @Min(value = 1L)
    @Column(name = "delivered_amount")
    private Long deliveredAmount;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("")
    private DeliveryOrder deliveryOrder;

    @OneToOne(optional = false)
    @NotNull
    @JoinColumn(unique = true)
    private OnlineOrderItem onlineOrderItem;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPreparedAmount() {
        return preparedAmount;
    }

    public DeliveryOrderItem preparedAmount(Long preparedAmount) {
        this.preparedAmount = preparedAmount;
        return this;
    }

    public void setPreparedAmount(Long preparedAmount) {
        this.preparedAmount = preparedAmount;
    }

    public Long getDeliveredAmount() {
        return deliveredAmount;
    }

    public DeliveryOrderItem deliveredAmount(Long deliveredAmount) {
        this.deliveredAmount = deliveredAmount;
        return this;
    }

    public void setDeliveredAmount(Long deliveredAmount) {
        this.deliveredAmount = deliveredAmount;
    }

    public DeliveryOrder getDeliveryOrder() {
        return deliveryOrder;
    }

    public DeliveryOrderItem deliveryOrder(DeliveryOrder deliveryOrder) {
        this.deliveryOrder = deliveryOrder;
        return this;
    }

    public void setDeliveryOrder(DeliveryOrder deliveryOrder) {
        this.deliveryOrder = deliveryOrder;
    }

    public OnlineOrderItem getOnlineOrderItem() {
        return onlineOrderItem;
    }

    public DeliveryOrderItem onlineOrderItem(OnlineOrderItem onlineOrderItem) {
        this.onlineOrderItem = onlineOrderItem;
        return this;
    }

    public void setOnlineOrderItem(OnlineOrderItem onlineOrderItem) {
        this.onlineOrderItem = onlineOrderItem;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        DeliveryOrderItem deliveryOrderItem = (DeliveryOrderItem) o;
        if (deliveryOrderItem.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), deliveryOrderItem.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "DeliveryOrderItem{" +
            "id=" + getId() +
            ", preparedAmount=" + getPreparedAmount() +
            ", deliveredAmount=" + getDeliveredAmount() +
            "}";
    }
}
