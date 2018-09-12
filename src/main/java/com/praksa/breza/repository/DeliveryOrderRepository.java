package com.praksa.breza.repository;

import com.praksa.breza.domain.DeliveryOrder;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the DeliveryOrder entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DeliveryOrderRepository extends JpaRepository<DeliveryOrder, Long> {

}
