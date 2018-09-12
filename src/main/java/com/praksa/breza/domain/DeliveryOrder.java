package com.praksa.breza.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A DeliveryOrder.
 */
@Entity
@Table(name = "delivery_order")
public class DeliveryOrder implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "delivery_date")
    private LocalDate deliveryDate;

    @NotNull
    @Column(name = "status", nullable = false)
    private String status;

    @ManyToOne
    @JsonIgnoreProperties("")
    private Employee driver;

    @ManyToOne
    @JsonIgnoreProperties("")
    private Employee warehouseClerk;

    @ManyToOne
    @JsonIgnoreProperties("")
    private Vehicle vehicle;

    @OneToOne(optional = false)
    @NotNull
    @JoinColumn(unique = true)
    private OnlineOrder onlineOrder;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDeliveryDate() {
        return deliveryDate;
    }

    public DeliveryOrder deliveryDate(LocalDate deliveryDate) {
        this.deliveryDate = deliveryDate;
        return this;
    }

    public void setDeliveryDate(LocalDate deliveryDate) {
        this.deliveryDate = deliveryDate;
    }

    public String getStatus() {
        return status;
    }

    public DeliveryOrder status(String status) {
        this.status = status;
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Employee getDriver() {
        return driver;
    }

    public DeliveryOrder driver(Employee employee) {
        this.driver = employee;
        return this;
    }

    public void setDriver(Employee employee) {
        this.driver = employee;
    }

    public Employee getWarehouseClerk() {
        return warehouseClerk;
    }

    public DeliveryOrder warehouseClerk(Employee employee) {
        this.warehouseClerk = employee;
        return this;
    }

    public void setWarehouseClerk(Employee employee) {
        this.warehouseClerk = employee;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public DeliveryOrder vehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
        return this;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public OnlineOrder getOnlineOrder() {
        return onlineOrder;
    }

    public DeliveryOrder onlineOrder(OnlineOrder onlineOrder) {
        this.onlineOrder = onlineOrder;
        return this;
    }

    public void setOnlineOrder(OnlineOrder onlineOrder) {
        this.onlineOrder = onlineOrder;
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
        DeliveryOrder deliveryOrder = (DeliveryOrder) o;
        if (deliveryOrder.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), deliveryOrder.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "DeliveryOrder{" +
            "id=" + getId() +
            ", deliveryDate='" + getDeliveryDate() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
